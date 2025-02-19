import { ONE_MONTH_TO_MILLISECONDS } from "../constants";

export const generateDBURL = (host: string | undefined, port: string | undefined, name: string | undefined): string => {
    if (!host || !port || !name) {
        return '';
    }
    return `${host}:${port}/${name}`;
}

export const getNumericalValue = (value: string | number | undefined, fallback: number = 0 ) => {
    if(typeof value === 'string'){
        return new Function(`return ${value}`)();
    }
    if(typeof value === 'undefined'){
        return fallback;
    }
    return isNaN(value) ? fallback : value;
}

export const thirtyDaysAgo = () => new Date(Date.now() - ONE_MONTH_TO_MILLISECONDS);