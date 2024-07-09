import { socialLinks } from '@/lib/Constant'
import React from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import NextImage from './NextImage'

const Intro = () => {
    return (
        <div className="flex flex-col gap-4 text-gray-600 dark:text-neutral-400">
            <div className="flex items-center gap-4">
                <NextImage
                    src="/pk.webp"
                    className="rounded-full"
                    height={120}
                    width={120}
                    alt="logo"
                />
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl">Hey, I'm Pankaj Thakur</h1>
                    <span>Software Developer</span>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                                {<link.icon height={20} width={20} />}
                            </a>
                        ))}
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
            <hr />
            <p className="flex flex-col gap-4 text-justify">
                <span>
                    I am a dedicated software developer based in India, with a strong focus on building high-quality websites and applications. My passion lies in continuously learning new technologies and applying them to create innovative and efficient solutions.
                </span>
                <span>
                    Currently, I am employed as a Junior Software Developer at Netclues India Private Limited, where I contribute to various projects and enhance my technical skills.
                </span>
                <span>
                    Feel free to contact me at <a href="mailto:pankaj@thakur.dev" className="text-blue-600 underline">pankaj@thakur.dev</a>
                </span>
            </p>


        </div>
    )
}

export default Intro