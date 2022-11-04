import React, { Fragment } from 'react';

const CurrencyValue = (props: { currency: string; amount: number; rates: Object }) => {

    const getGBP = (amount: number, rates: any) => {
        return Math.round(amount * rates.GBP);
    }

    const getLocalCurrencyStr = (amount: number, rates: Object) => {
        if (Object.keys(rates).length && rates.hasOwnProperty('GBP'))
            return ' / £' + getGBP(amount, rates);
        else return '';
    }
    return (
        <Fragment>{props.currency}{props.amount}{getLocalCurrencyStr(props.amount, props.rates)}</Fragment>
    )
}

export default CurrencyValue;
