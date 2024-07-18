import { ExternalLinkIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ProjectData } from "@/lib/Constant";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ProjectsPage() {
	return (
		<div className="mx-auto mt-4">
			<hr />
			<h4 className="text-md md:text-xl font-medium my-4"> Projects</h4>
			<div className="space-y-4">
				{ProjectData.map(
					({ title, live, description, github, techstack }, index) => (
						<Card key={index} className="p-4">
							<div className="flex justify-between items-start mb-2">
								<h4 className="text-md font-medium">{title}</h4>
								<div className="flex gap-5">
									<Link
										href={live}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-400 hover:text-blue-800">
										<ExternalLinkIcon height={22} width={22} />
									</Link>
									<Link
										href={github}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-gray-800">
										<GitHubLogoIcon height={22} width={22} />
									</Link>
								</div>
							</div>
							<p className="text-sm mb-2 text-gray-600 dark:text-neutral-400">
								{description}
							</p>
							<div className="flex flex-wrap gap-1">
								{techstack.map((tech, index) => (
									<Badge
										key={index}
										variant="outline"
										className="text-xs px-2 py-0.5 text-gray-600 dark:text-neutral-400">
										{tech}
									</Badge>
								))}
							</div>
						</Card>
					),
				)}
			</div>
		</div>
	);
}

export default ProjectsPage;
