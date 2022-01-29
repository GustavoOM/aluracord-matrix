import { Box, Text, TextField, Image, Button} from '@skynexui/components';
import { IoSend } from "react-icons/io5";
import React from 'react';
import appConfig from '../config.json';
import {createClient} from "@supabase/supabase-js"
import {ButtonSendSticker} from "../src/components/ButtonSendStick"


const SUPABASE_URL = "https://purgrbiakzircqibvvyw.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM3MTc4NiwiZXhwIjoxOTU4OTQ3Nzg2fQ.wMFWELWxDyyfyRmZa93blQv1voIAUEV7VSNk9Ql8MIc"
const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY)

function takeMessageInRealTime(addNewMessage){
    return supabaseClient
        .from("message")
        .on("INSERT", (realtime) => {
            addNewMessage(realtime.new)
        })
        .subscribe()
}

import {useRouter} from "next/router"

export default function ChatPage() {
    const router = useRouter()
    const currentUser = router.query.username
    const [message, setMessage] = React.useState('')
    const [messageList, setMessageList] = React.useState([])


    // Sua lógica vai aqui

    React.useEffect((data) => {
        const supabaseData = supabaseClient
            .from("message")
            .select("*")
            .order("id",{ascending:false})
            .then((data) => {
                setMessageList(data.data)
            })
        takeMessageInRealTime((newMessage)=>{
            setMessageList((currentListValue) => {
                return [ 
                    newMessage,
                    ...currentListValue
                ]
            })
        })
    },[])

    function handleNewMessage(newMessage) {
        if(newMessage){
            const message = {
                from: currentUser,
                text: newMessage
            }
            supabaseClient.from("message").insert([message]).then(({data})=>{})
        }

        setMessage("")
    }

    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList messageList={messageList} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField id = "tf"
                            value={message}
                            onChange={(event) => {
                                const valor = event.target.value
                                setMessage(valor)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    handleNewMessage(message)
                                }
                            }}
                            placeholder="Insira sua message aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button 
                            label='Enviar'
                            onClick={() => {
                                handleNewMessage(message)
                                document.getElementById("tf").focus()
                            }}
                            styleSheet={{
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                height: "83%",
                                marginBottom: "8px",
                                marginRight: "8px",
                            }}
                        />
                        <ButtonSendSticker 
                            onStickerClick={(sticker)=>{
                                handleNewMessage(`:sticker:$    {sticker}`)

                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
                
            }}
        >

            {props.messageList.map((message) => {
                return (

                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: "flex"
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text tag="strong">
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {message.text.startsWith(":sticker:")
                        ?(
                            <Image src={message.text.replace(":sticker:", "")}/>
                        )
                        :(
                            message.text
                        )}
                    </Text>
                )
            })}

        </Box>
    )
}