import { useContext, useState } from "react"
import { MqttClient } from "mqtt"
import FeedbackMessageContext from "../context/FeedbackMessageContext"
import FeedbackMessage from "../classes/FeedbackMessage"
import ClientContext from "../context/ClientContext"
import { MQTTClientContextType } from "../@types/mqtt"

const useSubscribeToTopic = () => {
    
    const {changeFeedbackMessage} = useContext(FeedbackMessageContext)

    const {client} = useContext(ClientContext) as MQTTClientContextType

    const [loading, setLoading] = useState<boolean>(false)
    const [unsubLoading, setUnsubLoading] = useState<boolean>(false)

    const [subscribedTopics, setSubscribedTopics] = useState<string[]>([])

    const subscribe = async(topic:string):Promise<void> => {

        if (subscribedTopics.includes(topic)) {
            changeFeedbackMessage(new FeedbackMessage(`Already subscribed to topic.`, 'bad'))
            console.log(`Already subscribed to topic '${topic}'`)
            return;
        }

        if (topic.trim() === '') {
            changeFeedbackMessage(new FeedbackMessage('Invalid topic.', 'bad'))
            console.log('Invalid topic.')
            return;
        }

        try {
            setLoading(true)
            await client?.subscribeAsync(topic)
            setLoading(false)
            changeFeedbackMessage(new FeedbackMessage(`Subscribed to topic.`, 'good'))
            setSubscribedTopics((prev) => [...prev, topic])
        } catch (error) {
            setLoading(false)
            console.log(error)
            changeFeedbackMessage(new FeedbackMessage('Something went wrong.', 'bad'))
        }

    }

    const unsubscribe = async(topic:string):Promise<void> => {

        if (!subscribedTopics.includes(topic)) {
            changeFeedbackMessage(new FeedbackMessage('Topic not subscribed.', 'bad'))
            console.log('Topic not subscribed.')
            return;
        }

        if (topic.trim() === '') {
            changeFeedbackMessage(new FeedbackMessage('Invalid topic.', 'bad'))
            console.log('Invalid topic.')
            return;
        }

        try {
            setUnsubLoading(true)
            await client?.unsubscribeAsync(topic)
            setUnsubLoading(false)
            changeFeedbackMessage(new FeedbackMessage(`Unsubscribed from topic.`, 'bad'))
            setSubscribedTopics((prev) => prev.filter(prevTopic => prevTopic !== topic))
        } catch (error) {
            setUnsubLoading(false)
            console.log(error)
            changeFeedbackMessage(new FeedbackMessage('Something went wrong.', 'bad'))
        }

    }

    return {
        loading, 
        subscribe,
        unsubscribe,
        unsubLoading,
        subscribedTopics
    }
}

export default useSubscribeToTopic;