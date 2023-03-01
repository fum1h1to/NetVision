export const cartesian2Polar = (x: number, y: number, z: number): [number, number, number] => {
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.acos(z / r);
    const phi = Math.atan2(y, x);
    return [r, theta, phi];
}

export const polar2Cartesian = (r: number, lat: number, lng: number): [number, number, number] => {
    const theta = Math.PI * (lat + 90) / 180;
    const phi = Math.PI * (lng * -1) / 180;

    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);
    return [x, y, z];
}