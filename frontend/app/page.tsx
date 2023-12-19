"use client";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import TrafficChart, {TrafficDataItem} from "@/components/component/TrafficChart";

export default function Home() {
    const [startDate, setStartDate] = useState((new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)));
    const [endDate, setEndDate] = useState(new Date());
    const [data, setData] = useState<TrafficDataItem[]>([]);
    const [sendUsage, setSendUsage] = useState(0);
    const [receiveUsage, setReceiveUsage] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchAndSetData = (startString: string, endString: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/?start=${startString}&end=${endString}`).then(async (res) => {
            // parse as json
            const data = await res.json();
            setData(data);
            let sendTemp = 0;
            let receiveTemp = 0;
            for (const item of data) {
                sendTemp += item.tx;
                receiveTemp += item.rx;
            }

            const roundNumber = (num: number, precision: number) => {
                return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
            };
            setSendUsage(roundNumber(sendTemp, 2));
            setReceiveUsage(roundNumber(receiveTemp, 2));
            setLoading(false);
        }).catch((e) => console.error(e));
    }
    const handleFilterApply = (event: React.FormEvent) => {
        event.preventDefault();
        const startString = startDate.toISOString().substring(0, 10);
        const endString = endDate.toISOString().substring(0, 10);
        fetchAndSetData(startString, endString)
    };
    useEffect(() => {
        const startString = startDate.toISOString().substring(0, 10);
        const endString = endDate.toISOString().substring(0, 10);
        fetchAndSetData(startString, endString)
    }, [endDate, startDate]);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex flex-col w-full min-h-screen p-4 md:p-6">
                <div className="grid gap-4 md:gap-8">
                    <h1 className="text-2xl font-bold tracking-tight">Network Traffic Viewer</h1>
                    <form className="grid gap-4 md:gap-8 grid-cols-2 md:grid-cols-[auto_1fr] items-end"
                          onSubmit={handleFilterApply}>
                        <label className="font-semibold text-sm">Filter by date:</label>
                        <div className="grid gap-4 grid-cols-2">
                            <Input defaultValue={startDate.toISOString().substring(0, 10)} placeholder="Start Date"
                                   type="date"
                                   onChange={(e) => {
                                       setStartDate(new Date(Date.parse(e.target.value)));
                                   }
                                   }/>
                            <Input defaultValue={endDate.toISOString().substring(0, 10)} placeholder="End Date"
                                   type="date"
                                   onChange={(e) => {
                                       setEndDate(new Date(Date.parse(e.target.value)));
                                   }
                                   }/>
                        </div>
                        <Button className="w-full md:w-auto justify-self-end" type="submit">
                            Apply Filter
                        </Button>
                    </form>
                    <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Network Usage Graph</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <TrafficChart data={data} loading={loading}/>
                            </CardContent>
                        </Card>
                        {/*<Card>*/}
                        {/*    <CardHeader className="pb-2 space-y-0">*/}
                        {/*        <CardTitle className="text-sm font-medium">Bar Graph 2</CardTitle>*/}
                        {/*    </CardHeader>*/}
                        {/*    <CardContent className="p-0">*/}
                        {/*        <img*/}
                        {/*            alt="Second bar graph of network traffic"*/}
                        {/*            height="200"*/}
                        {/*            src="/placeholder.svg"*/}
                        {/*            style={{*/}
                        {/*                aspectRatio: "400/200",*/}
                        {/*                objectFit: "cover",*/}
                        {/*            }}*/}
                        {/*            width="400"*/}
                        {/*        />*/}
                        {/*    </CardContent>*/}
                        {/*</Card>*/}
                        <Card>
                            <CardHeader className="pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Data usage
                                    from {startDate.toISOString().substring(0, 10)} to {endDate.toISOString().substring(0, 10)}:</p>
                                Send: <div className="font-bold text-lg">{sendUsage}GB</div>
                                Receive: <div className="font-bold text-lg">{receiveUsage}GB</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}
