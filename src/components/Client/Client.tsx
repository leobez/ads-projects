import { FormEvent, useContext, useState } from 'react'
import styles from './Client.module.css'
import useSubscribeToTopic from '../../hooks/useSubscribeToTopic'
import Chat from '../Chat/Chat'
import ClientContext from '../../context/ClientContext'
import { MQTTClientContextType } from '../../@types/mqtt'
import Loading from '../Loading/Loading'

// STYLES ARES USED DYNAMICALLY

const Client = () => {

    // Client context
    const {client, topics, updateMessage} = useContext(ClientContext) as MQTTClientContextType

    // Sub hook
    const {subscribe, subLoading, unsubscribe, unsubLoading} = useSubscribeToTopic()

    // Component states
    const [topic, setTopic] = useState<string>('')
    const [chosenTopic, setChosenTopic] = useState<string>('')

    const handleSubscribe = async(e:FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault()
        await subscribe(topic)
    }

    const handleUnsubscribe = async(e:any):Promise<void> => {
        e.preventDefault()
        const selectedTopic = e.target.id

        if (chosenTopic === selectedTopic) {
            setChosenTopic('')
        }

        await unsubscribe(selectedTopic)
    }

    const handleSelect = (e:any):void => {
        e.preventDefault()
        
        const selectedTopic = e.target.id
    
        // Verify if there are no other topics selected
        if (chosenTopic === '') {
            setChosenTopic(selectedTopic)
            e.target.classList.add(`${styles['selected']}`)
            updateMessage(`Current topic: '${selectedTopic}' .`, 'addSystem')
        } else {
            // Verify if clicked the same
            if (chosenTopic === selectedTopic) {
                e.target.classList.remove(`${styles['selected']}`)
                setChosenTopic('')
                updateMessage(`Current topic: <none>`, 'addSystem')
            } else {
                // Is clicking other, therefore, unselect previous one and select current one
                const DIV_previous = document.querySelector(`form#${chosenTopic}`)
                DIV_previous?.classList.remove(`${styles['selected']}`)
                e.target.classList.add(`${styles['selected']}`)
                setChosenTopic(selectedTopic)
                updateMessage(`Current topic: '${selectedTopic}' .`, 'addSystem')
            }
        }

    }

    return (

        <div className='w-full'>

            {client && client.options &&
                <>
                    <div className='border-2 p-1 mt-1 grid gap-1 border-amber-600 bg-amber-400'>

                        <div className='bg-white p-1 border-2 grid grid-rows-2 gap-2'>

                            <table className='border-2 border-black border-collapse w-full'>
                                <tr>
                                    <th className='table-list border-black'>User</th>
                                    <th className='table-list border-black'>Server</th>
                                </tr>
                                <tr>
                                    <td className='table-list text-sm'>
                                        {client.options.clientId}
                                    </td>
                                    <td className='table-list text-sm'>
                                        {client.options.host}
                                    </td>
                                </tr>
                            </table>

                            <form onSubmit={handleSubscribe} className='grid gap-1'>

                                <div className='grid gap-1'>
                                    <label htmlFor="topic">Enter the topic you want to subscribe: </label>
                                    <input 
                                        type="text"
                                        name='topic'
                                        onChange={(e) => setTopic(e.target.value)}
                                        value={topic}
                                        className='border-2 border-amber-600 text-lg p-1 text-black w-full'
                                    />
                                </div>

                                {subLoading && <input type="submit" value='Subscribing to topic...' disabled className='form-button mt-1'/>}
                                {unsubLoading && <input type="submit" value='Unsubscribing from topic...' disabled className='form-button mt-1'/>}
                                {!subLoading && !unsubLoading && <input type="submit" value='Subscribe to topic' className='form-button mt-1'/>}

                            </form>

                        </div>

                        <div className='bg-white border-2 '>

                            <table className='border-2 border-black border-collapse w-full table-fixed'>
                                <tr>
                                    <th className='table-list border-black'>Topic</th>
                                    <th className='table-list border-black'>Unsub</th>
                                    <th className='table-list border-black'>Use</th>
                                </tr>

                                {topics && topics.map((topic) => (
                                    <tr key={topic}>

                                        <td className='table-list text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                                            {topic}
                                        </td>

                                        <td className='table-list'>
                                            <form onSubmit={handleUnsubscribe} id={topic}>
                                                <input type="submit" value='unsub' className='menu-icon'/>       
                                            </form>
                                            
                                        </td>
                                        
                                        <td className='table-list'>
                                            <form onSubmit={handleSelect} id={topic}>                                              
                                                <input type="submit" value='use' className='menu-icon'/>                 
                                            </form>
                                        </td>

                                    </tr>
                                ))}

                            </table>


                            <div className='grid place-items-center gap-1 px-1'>

                                {subLoading && 
                                    <>
                                        <Loading message='Subscribing...'/>
                                    </>
                                }

                                {unsubLoading && 
                                    <>
                                        <Loading message='Unsubscribing...'/>
                                    </>
                                }

                            </div>

                        </div>

                    </div>

                    {/* <div className={styles.chatcontainer}>
                        <Chat chosenTopic={chosenTopic}/>
                    </div> */}
                    
                </>
            }
            
        </div>
    )
}

export default Client