import React from 'react';
import { skillsData } from '@/lib/Constant';


const Skills: React.FC = () => {
  return (
    <div className="mx-auto mt-10">
      <hr />
      <h4 className="text-md md:text-xl font-medium my-4">Skills</h4>
      <ul className="flex flex-wrap items-center gap-2">
        {skillsData.map((skill) => (
          <li key={skill.name}>
            <button type="button" aria-label="Skill button">
              <span className="inline-flex text-primary py-0.5 px-3 items-center justify-between text-xs capitalize border border-primaryBorder rounded-full hover:bg-gray-gray1">
                {skill.iconUrl && (
                  <img
                    src={skill.iconUrl}
                    alt={`${skill.name} icon`}
                    width="16"
                    height="16"
                    className="object-cover w-[16px] h-[16px] mr-1"
                  />
                )}
                <span className="capitalize lg:inline leading-5 text-gray-600 dark:text-neutral-400">{skill.name}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
