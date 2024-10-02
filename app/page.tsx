import { MyChart } from "@/components/ui/custom/cart";

const Page = () => {
  return (
    <div className="dark bg-slate-950 min-h-screen h-full text-slate-50 p-4 md:p-20">
      <h1 className="text-xl md:text-2xl font-bold py-4">
        Real-time Dashboard!
      </h1>
      <p className=" text-lg md:text-xl font-semibold">
        This is a demo chart to show, realtime data updates from server using
        SSE (Server Sent Events) steam.
      </p>
      <MyChart />
    </div>
  );
};
export default Page;
