import React from 'react';

// personal details section
// all of your resume details
export default function PersonalDetails({ resume = {} }) {
  // Destructure with fallbacks so nothing explodes if a field is missing
  const {
    name = "",
    job = "",
    address = "",
    photo = "",
    phone = "",
    email = "",
    themeColor = "#000",
  } = resume;

// export default function PersonalDetails({ resume }) {

  return (
    <>
        <h2 
            className='font-bold text-xl text-center ' 
            style={{ color: resume.themeColor }}
            >
                {resume.name}
            </h2>
            <h2 className='text-center text-sm font-medium capitalize'>{resume.job}</h2>
            {/* <h2 className='text-center text-sm font-medium'>{resume.address}</h2> */}

            {/* <div className='flex  items-center justify-center gap-10  my-2 '>
                <h2 className='font-normal text-xs'>{resume.photo}</h2>
                <h2 className='font-normal text-xs'>{resume.email}</h2>
                <h2 className='font-normal text-xs'>{resume.phone}</h2>
                <h2 className='text-center text-sm font-medium capitalize'>{resume.address}</h2>
            </div> */}

            <div className="flex w-full items-center my-2 gap-4">
              {/* find out what where this photo is from */}
            {/* <h2 className="flex-1 text-center text-xs font-normal truncate">{resume.photo}</h2> */}
            <h2 className="flex-1 text-center text-xs font-normal truncate">{resume.email}</h2>
            <h2 className="flex-1 text-center text-xs font-normal truncate">{resume.phone}</h2>
            <h2 className="flex-1 text-center text-sm font-medium capitalize truncate">{resume.address}</h2>
          </div>

            <hr 
                className='border-[1.5px] my-2' 
                style={{ borderColor: resume.themeColor }}
            />
    </>
  )
}
