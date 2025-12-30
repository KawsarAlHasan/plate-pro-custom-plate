// _clientcomponent

// getstarted
'use client'
import React, { useState } from 'react'
import Image from "next/image";
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ShapePreview6 from '../../_component/getstarted/shapePreview6';
// import ShapePreview2 from '../../_component/getstarted/shapePreview2';
import Ushape from './ushape';
import HorizontalRectangle from './horizontalrectangle';
import ShapePreview3 from '../../_component/getstarted/ShapePreview3';
import ShapePreview5 from '../../_component/getstarted/shapePreview5';
// import ResizableRoundedShape from './resizableroundedshape';
import Shape7 from '../../_component/getstarted/shape7';
import Newshape1 from './newshape1';
import Elshape from './elshape';

export default function ClientComponent() {
    const [previewImage, setPreviewImage] = useState('');
    const [previewComponent, setPreviewComponent] = useState('');
    const allShapes = [
        {
            id: 1,
            name: 'Square',
            img: '/Square.png',
            previewImage: '/Square.png'
        },
        {
            id: 2,
            name: 'ushape',
            img: '/ushape.png',
            previewImage: '/Square.png'
        },
        {
            id: 3,
            name: 'reactangle',
            img: '/reactangle.png',
            previewImage: '/Square.png'
        },
        {
            id: 4,
            name: 'ractangle with rounded corner',
            img: '/ractangle_with_rounded_corner.png',
            previewImage: '/Square.png'
        },
        {
            id: 5,
            name: 'Square',
            img: '/Square.png',
            previewImage: '/Square.png'
        },
        {
            id: 6,
            name: 'Square',
            img: '/shape8.png',
            previewImage: '/Rectangle7.png'
        },
        {
            id: 7,
            name: 'Square',
            img: '/shape3.png',
            previewImage: '/Square.png'
        },
        {
            id: 8,
            name: 'Lshape',
            img: '/lshape.png',
            previewImage: '/lshape.png'
        },
    ]
    const handleShapeClick = (item) => {
        setPreviewImage(item.img)
        setPreviewComponent(item.id)
    }
    const points = [
        { x: 100, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 200 },
        { x: 0, y: 200 },
        { x: 0, y: 100 },
        { x: 100, y: 100 },
    ]
    const originalPointsRef = [
        { x: 66.0855, y: 0 },
        { x: 163.126, y: 0 },
        { x: 227, y: 64.4295 },
        { x: 227, y: 240 },
        { x: 0, y: 240 },
        { x: 0, y: 64.4295 },
    ];
    return (
        <>
            <main className='flex '>
                <aside className='w-1/3 h-screen border-r-2 overflow-y-scroll '>
                    {/* ----shape list wrapper---- */}
                    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-5'>
                        {allShapes.map((shape, i) => (
                            <div
                                key={shape.id}
                                className='aspect-[240/280] flex flex-col items-center border border-gray-400 rounded-lg overflow-hidden group hover:border-red-400 cursor-pointer'
                                onClick={() => handleShapeClick(shape)}
                            >
                                <div className='w-full h-fit'>
                                    <Image
                                        src={shape.img}
                                        alt="My Image"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                                <p className='w-full text-center py-2 bg-gray-300 rounded-b-lg group-hover:bg-red-400'>{shape.name}</p>
                            </div>
                        ))}
                    </div>
                </aside>
                <div className='w-2/3 h-auto'>
                    {/* ---content wrapper--- */}
                    <div className='w-full h-full p-5'>
                        {/* ===image_preview_wrapper==== */}
                        <div className='w-full h-full flex justify-center'>
                            {/* ===preview box=== */}
                            <div className='w-full h-full flex flex-col items-center justify-center'>
                                {
                                    previewComponent ?
                                        <div className='w-full h-full'>
                                            {previewComponent === 1 && <ShapePreview6 />}
                                            {previewComponent === 2 && <Shape7 />}
                                            {previewComponent === 3 && <HorizontalRectangle />}
                                            {previewComponent === 4 && <ShapePreview5 />}
                                            {previewComponent === 5 && <ShapePreview3 />}
                                            {previewComponent === 6 && <Newshape1 />}
                                            {previewComponent === 7 && < Ushape />}
                                            {previewComponent === 8 && <Elshape points={points} />}
                                            {/* {previewComponent === 6 && <ShapePreview2 />} */}
                                        </div>
                                        :
                                        <ShapePreview6 />
                                }
                                {
                                    previewImage &&
                                    <div className='w-full flex justify-end'>
                                        <Link href="/previewandsummary">
                                            <button
                                                className='px-12 py-4 bg-black text-white'
                                            >Next
                                            </button>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
