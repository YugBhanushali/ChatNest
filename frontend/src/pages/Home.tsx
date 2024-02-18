import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <div>Welcome to chat app</div>
      <Button type="button">
        <a href="/auth">Login</a>
      </Button>
    </>
  );
};

export default Home;
