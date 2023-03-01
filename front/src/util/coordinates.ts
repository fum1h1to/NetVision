export const cartesian2Polar = (x: number, y: number, z: number): [number, number, number] => {
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.acos(z / r);
    const phi = Math.atan2(y, x);
    return [r, theta, phi];
}

export const latlng2Cartesian = (r: number, lat: number, lng: number): [number, number, number] => {
    const theta = (lng - 180) * Math.PI / 180;
    const phi = lat * Math.PI / 180;

    const x = -1 * r * Math.cos(phi) * Math.cos(theta);
    const y = r * Math.sin(phi);
    const z = r * Math.cos(phi) * Math.sin(theta);
    return [x, y, z];
}