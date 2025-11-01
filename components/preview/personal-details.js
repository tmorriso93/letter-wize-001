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
    website = "",
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
            <h2 className='text-center text-sm font-medium capitalize dark:text-slate-900'>{resume.job}</h2>
            {/* <h2 className='text-center text-sm font-medium'>{resume.address}</h2> */}

            {/* <div className='flex  items-center justify-center gap-10  my-2 '>
                <h2 className='font-normal text-xs'>{resume.photo}</h2>
                <h2 className='font-normal text-xs'>{resume.email}</h2>
                <h2 className='font-normal text-xs'>{resume.phone}</h2>
                <h2 className='text-center text-sm font-medium capitalize'>{resume.address}</h2>
            </div> */}

            <div className="flex w-full flex-wrap items-center justify-center my-2 gap-3 text-xs font-normal text-slate-600 dark:text-slate-800">
              {[email, phone, website && website.replace(/^https?:\/\//i, ""), address].filter(Boolean).map((item, index) => (
                <span key={index} className="truncate text-center max-w-[70%] sm:max-w-[45%]">
                  {item}
                </span>
              ))}
            </div>

            <hr 
                className='border-[1.5px] my-2' 
                style={{ borderColor: resume.themeColor }}
            />
    </>
  )
}
