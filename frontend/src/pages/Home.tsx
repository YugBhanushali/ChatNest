import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigator = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <div className="flex text-[23px] font-bold">Welcome to chat app</div>
      <div>
        <Button type="button" onClick={() => navigator("/auth")}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Home;
