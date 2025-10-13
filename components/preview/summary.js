import React from 'react';
import parse from 'html-react-parser';


// Summary component to display the summary section in the resume preview
export default function Summary({ resume }) {
return ( 
    <div className='mt-5'>
        <h2 
            className='font-bold mb-3 text-left' 
            style={{color: resume.themeColor }}
        >
            Summary
        </h2>
        
        {resume.summary && ( 
           <div className='text-xs font-normal text-left'>
            {/* parse any rich text editor effects on the summary */}
            {parse(resume.summary)}
            
        </div>
        )}
        
    </div>
    
)
}

