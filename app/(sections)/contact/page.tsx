import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function page() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center border-spacing-2 border-b-2 border-b-blue-600 my-10">
        Contact
      </h1>
      <div className="flex flex-col md:flex-row lg:w-[70%] items-center justify-around">
        <Card className="w-[100vw] p-5 lg:w-[500px]">
          <form>
            <div className="mb-6">
              <Input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                required
              />
            </div>
            <div className="mb-6">
              <Input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="mb-6">
              <Textarea
                rows={5}
                name="message"
                placeholder="Enter Your Message"
                required
              />
            </div>
            <div>
              <Button variant="default" className="w-full" type="submit">
                Send Message
              </Button>
              {/* <div>
                  {message ? (
                    <p className="text-green-500 text-center mt-2">
                      Message Sent Successfully
                    </p>
                  ) : null}
                </div> */}
            </div>
          </form>
        </Card>
        <div className="lg:w-[500px] hidden md:block">
          <img
            className="h-[300px] w-[300px] lg:h-[500px] lg:w-[500px]"
            src="/contact.svg"
            alt="contactimg"
          />
        </div>
      </div>
    </div>
  );
}

export default page;
