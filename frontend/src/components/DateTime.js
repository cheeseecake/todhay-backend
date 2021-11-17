import  React, { useState , useEffect } from 'react'

export const DateTime = () => {
    var [date,setDate] = useState(new Date());  
    useEffect(() => {
        var timer = setInterval(()=>setDate(new Date()), 10000 )
        return function cleanup() {
            clearInterval(timer)
        }
    });
    return(
        <div>
            {date.toLocaleTimeString('default', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',hour: '2-digit', minute:'2-digit'})}
        </div>
    )
}

export default DateTime