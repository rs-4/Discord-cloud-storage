import React from 'react'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

export default function InfoData({name, data, symbol}: {name: string, data: string, symbol: string}) {
  return (
    <div className="">
         <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {name}
                  </CardTitle>
                 {symbol && <Label className="text-xs">{symbol}</Label>}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data}</div>
                  <p className="text-xs text-muted-foreground">
                  </p>
                </CardContent>
              </Card>
    </div>

  )
}
