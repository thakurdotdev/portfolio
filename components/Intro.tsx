import { socialLinks } from '@/lib/Constant'
import React from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import NextImage from './NextImage'

const Intro = () => {
    return (
        <div className="flex flex-col gap-4">
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
            <p className="flex flex-col gap-4">
                <span>
                    I'm a software developer based in India. I specialize in building
                    websites and applications. I'm passionate about learning new
                    technologies and building cool stuff.
                </span>
                <span>
                    I am Currently working at Netclues India Private Limited as a Junior Software Developer.
                </span>
            </p>
        </div>
    )
}

export default Intro