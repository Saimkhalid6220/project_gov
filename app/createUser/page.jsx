import React from 'react'
import UserForm from '@/components/UserForm'

const CreateUser = () => {
  return (

<div>
  
  <div className="flex p-2 justify-between mt-auto mb-auto items-center border-b bg-white flex-wrap">
        <div className="flex ml-4 items-center">
          <img src="logo.png" alt="Logo" className="h-24" />
          <div className="relative items-center mt-auto mb-auto flex justify-center text-base mx-auto hidden md:inline-flex">
            <span className="rounded-md text-black text-center font-bold py-1 px-2 text-2xl">
              School Education & Literacy Department Legal Dashboard
            </span>
          </div>
        </div>
      </div>
      <UserForm />
      </div> 

  )
}

export default CreateUser