'use client'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ky from 'ky';

const URL = `https://tidy-spider-52.deno.dev`
// const URL = `https://studious-telegram-4qq55vqj74hqgwp-8000.app.github.dev`

export const socket = io(URL, {
    reconnectionDelayMax: 10000,
    transports: ['websocket', 'polling']
    // transports: ['websocket']
});

socket.on("connect", () => {
    console.log("Connected")
})

export type SearchTickerResult = { items: SearchTickerItem[] };
export type SearchTickerItem = { symbol: string, name: string }
export type AddTickerToMyListResult = { success: boolean }
export const searchTicker = async (searchTerm: string) => {
    return new Promise<SearchTickerResult>((res, rej) => {
        socket.emit('stock-list-request', {
            q: searchTerm
        });

        socket.once(`stock-list-response`, (args: SearchTickerResult) => {
            res(args);
        });
    });
}

export const AddTickerToMyList = (item: SearchTickerItem) => {
    socket.emit('mystocks-add-request', item);
}

export const RemoveItemFromMyList = (item: SearchTickerItem) => {
    socket.emit('mystocks-remove-request', item);
}

// export const LoadMyTickerList = () => {
//     return new Promise<SearchTickerItem[]>((res, rej) => {
//         socket.emit('mystocks-list-request');
//         socket.once(`mystocks-list-response`, (args: SearchTickerItem[]) => {
//             res(args);
//             console.log(JSON.stringify(args));
//         });
//     });
// }

export const useMyStockList = () => {
    const [mytickers, setMyTickers] = useState<SearchTickerItem[]>([]);
    useEffect(() => {
        socket.emit('mystocks-list-request');
        socket.on(`mystocks-list-response`, setMyTickers);
        return () => {
            socket.off('mystocks-list-response', setMyTickers);
        }
    }, []);
    return mytickers;
}

type OptionsData = {
    options: Map<string, {
        c: Map<number, {
            a: number,
            b: number,
            l: number,
            v: number
        }>
    }>
}

type StockPriceData = {
    quoteSummary: {
        price: {
            regularMarketPrice: number
        }

    }
}

export const useOptionTracker = (item: SearchTickerItem) => {
    const [od, setOd] = useState<OptionsData>();
    useEffect(() => {
        socket.emit('options-subscribe-request', item);
        socket.on(`options-subscribe-response`, setOd);
        return () => {
            socket.emit('options-unsubscribe-request', item);
            socket.off('options-subscribe-response', setOd);
        }
    }, []);
    return od;
}


export const useStockPrice = (item: SearchTickerItem) => {
    const [od, setOd] = useState<StockPriceData>();
    const fn = async () => {
        const data = await ky(`/api/symbols/${item.symbol}/summary`).json<StockPriceData>();
        setOd(data);
    }
    useEffect(() => {
        fn();
        const i = setInterval(fn, 30000);
        return () => {
            clearInterval(i);
        }

        // socket.emit('stock-price-subscribe-request', item);
        // socket.on(`stock-price-subscribe-response`, (r: StockPriceData) => {
        //     if (r.item.symbol === item.symbol) {
        //         setOd(r);
        //     }
        // });
        // return () => {
        //     socket.emit('stock-price-unsubscribe-request', item);
        //     socket.off('stock-price-subscribe-response', setOd);
        // }
    }, [item.symbol]);
    return od;
}