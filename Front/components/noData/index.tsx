'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import  Link  from 'next/link'
import { Ban } from 'lucide-react'

export default function NoData({children}: {children: React.ReactNode}) {
        const [dataIsSet, setDataIsSet] = useState(false)
        const data = useSelector((state: any) => state.data)

        useEffect(() => {
                if(data.tokenId === '' || data.channelId === '') {
                        setDataIsSet(true)
                }
        }, [data])


    return (
        <div>
            {dataIsSet ? (
                 <div className="flex items-center justify-center h-96">
                <div className="p-12 rounded flex flex-col items-center justify-center space-y-4">
                        <Ban size={50} color="#f87171"/>
                        <h2 className="text-3xl font-bold tracking-tight text-rose-500">
                                No Settings Found
                        </h2>
                        <p className="text-sm text-muted-foreground ">
                                Please set your settings to continue
                        </p>
                        <Link href="/dashboard/settings">
                                <p className="underline underline-offset-8"> Settings</p>
                        </Link>
                                </div>
                        </div>
                                ) : 
                                     children
                                }          
        </div>
    )
}
