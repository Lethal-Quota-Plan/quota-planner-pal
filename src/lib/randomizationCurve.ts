import jStat from "jstat";

/**
 * Computes the average of y over x in (0, c] given:
 *   x = 0.5 + 0.5 * erf((y - a) / (sqrt(2) * b))
 * and y is clamped to ±yMax.
 *
 * @param c   Upper bound of x interval (0 < c ≤ 1)
 * @param a   Location parameter (default: 0.01763)
 * @param b   Scale parameter (default: 0.12085)
 * @param yMax  Clamping limit (default: 0.5)
 * @returns Average clamped y over x ∈ (0, c]
 */
export function averageClampedY(
    c: number,
    a: number = 0.01763,
    b: number = 0.12085,
    yMax: number = 0.5
): number {
    if (c <= 0 || c > 1) {
        throw new Error('c must be in (0, 1]');
    }

    const mu = a;
    const sigma = b;
    const yLow = -yMax;
    const yHigh = yMax;

    // x-values where clamping begins (using the normal CDF)
    const xLow = jStat.normal.cdf(yLow, mu, sigma);
    const xHigh = jStat.normal.cdf(yHigh, mu, sigma);

    // Helper: ∫ y * f(y) dy from y1 to y2
    // where f is the normal density N(mu, sigma^2)
    function partialExpectation(y1: number, y2: number): number {
        const z1 = (y1 - mu) / sigma;
        const z2 = (y2 - mu) / sigma;
        const Phi1 = jStat.normal.cdf(z1, 0, 1);
        const Phi2 = jStat.normal.cdf(z2, 0, 1);
        const phi1 = jStat.normal.pdf(z1, 0, 1);
        const phi2 = jStat.normal.pdf(z2, 0, 1);
        return mu * (Phi2 - Phi1) - sigma * (phi2 - phi1);
    }

    // Case 1: c entirely below the lower clamping threshold
    if (c <= xLow) {
        return yLow;
    }

    // Case 2: c lies within the unclamped region
    if (c <= xHigh) {
        // y corresponding to x = c (without clamping)
        const yC = jStat.normal.inv(c, mu, sigma);
        const integral = partialExpectation(yLow, yC);
        const total = yLow * xLow + integral;
        return total / c;
    }

    // Case 3: c extends into the upper clamped region
    const integralMid = partialExpectation(yLow, yHigh);
    const total = yLow * xLow + integralMid + yHigh * (c - xHigh);
    return total / c;
}