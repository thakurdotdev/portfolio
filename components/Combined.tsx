import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Experience from "./Experience";
import Education from "./Education";


const Combined = () => {
  return (
    <div className="flex justify-center mt-20">
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full rounded-full grid-cols-2">
          <TabsTrigger className="rounded-full" value="experience">Experience</TabsTrigger>
          <TabsTrigger className="rounded-full" value="education">Education</TabsTrigger>
        </TabsList>
        <TabsContent value="experience">
          <Experience />
        </TabsContent>
        <TabsContent value="education">
          <Education />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Combined;

