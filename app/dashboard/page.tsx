import Loader from "@/helper/loader";
 

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <Loader  color="primary" size="lg" text="Loading..."/>
    </main>
  );
}
