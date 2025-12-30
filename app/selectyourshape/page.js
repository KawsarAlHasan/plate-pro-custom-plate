'use client'
// %%%%%%%%%%%%%%%%%%%%get started%%%%%%%%%%%%%
import React, { useState } from 'react'
import ShapeCatergory from '../_component/getstarted/shapeCatergory'
import ShapePreview from '../_component/getstarted/shapePreview'
import ShapeTwo from '../_component/getstarted/shapeTwo'
import ShapePreview3 from '../_component/getstarted/ShapePreview3'
import ShapePreview5 from '../_component/getstarted/shapePreview5'
import ShapePreview6 from '../_component/getstarted/shapePreview6'
import ShapePreview2 from '../_component/getstarted/shapePreview2'
import OvalShape from '../_component/getstarted/ovalshape'

export default function page() {
  const [previewShape , setPreviewShape] = useState();
  const plateShapes = [
    {
      id:1,
      name:"shape1",
      image:"url/image"
    },
    {
      id:2,
      name:"shape2",
      image:"url/image"
    },
    {
      id:3,
      name:"shape3",
      image:"url/image"
    },
    {
      id:4,
      name:"shape4",
      image:"url/image"
    },
    {
      id:5,
      name:"shape5",
      image:"url/image"
    },
    {
      id:6,
      name:"shape6",
      image:"url/image"
    },
    {
      id:7,
      name:"shape7",
      image:"url/image"
    },
  ]
  const  handleShapePreview =(shape)=>{
    const a= shape;
    setPreviewShape(a.id)
  }
  return (
    <>
      <main>
        <div className='w-full h-[calc(100vh-100px)] flex'>

        <section className='w-full md:w-2/6 xl:w-1/5 h-full overflow-y-scroll border-r-2 py-8 px-5'>
            select your shape
            {/* <ShapeCatergory /> */}
            <ul className=' flex flex-col gap-5'>
              {
                plateShapes.map((shape, i)=>(
                  <div key={i} onClick={()=>handleShapePreview(shape)}>
                    <div className='aspect-[300/300] border'>
                      <div className='aspect-[300/300] bg-red-400'></div>
                      <div className='w-full h-fit'>
                        {shape.name}
                      </div>
                    </div>
                  </div>
                ))
              }
            </ul>
        </section>

        {/* ======component preview shape======== */}
        <section className='w-full h-full overflow-y-scroll md:w-4/6 xl:w-5/5'>
            preview your shape
            {
              previewShape===1 && <ShapePreview/>
            }
            {
              previewShape===2 && <ShapeTwo/>
            }
            {
              previewShape===3 && <ShapePreview3/>
            }
            {
              previewShape===4 && <ShapePreview5/>
            }
            {
              previewShape===5 && <ShapePreview6/>
            }
            {
              previewShape===6 && <ShapePreview2/>
            }
            {
              previewShape===7 && <OvalShape/>
            }

            {/* <ShapePreview/> */}
            {/* <ShapeTwo/> */}
            {/* <ShapePreview3/> */}
            {/* <ShapePreview5/> */}
            {/* <ShapePreview6/> */}
            
        </section>
        </div>
      </main>


    </>
  )
}
