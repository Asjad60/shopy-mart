import React from 'react'
import * as Icons1 from "react-icons/ai";
import  * as Icons2  from "react-icons/bs";
import  * as Icons3 from "react-icons/pi";

const AboutDelivery = () => {

    const deliveryDetails = [
        {
            title:"Free delivery",
            desc:"And free returns. See checkout for delivery dates.",
            icon: "BsBoxSeam"
        },
        {
            title:"Pay monthly at 0% APR",
            desc:"Choose to check out with Apple Card Monthly Installments.",
            icon: "AiOutlineDollar"
        },
        {
            title:"Personalize it",
            desc:"Engrave your device with your name or a personal note",
            icon: "PiDevices"
        },
    ]
  return (
    <div className='w-full bg-[#161d29] mt-20'>
       <div className='w-full max-w-maxContent mx-auto p-6 text-teal-50 flex flex-col md:flex-row gap-10 items-center justify-between'>
       {
            deliveryDetails.map((ele,i)=>{
                const Icon = Icons1[ele.icon] || Icons2[ele.icon] || Icons3[ele.icon]
                return(
                    <div className='flex flex-col gap-6 w-full max-w-[400px] h-full max-h-[250px] items-center justify-center' key={i}>
                        <Icon size={45}/>
                        <h2 className='text-xl font-medium'>{ele.title}</h2>
                        <p className='text-center tracking-wider'>{ele.desc}</p>
                    </div>
                )
            })
        }
       </div>
    </div>
  )
}

export default AboutDelivery