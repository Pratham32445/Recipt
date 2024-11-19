import { useEffect, useRef, useState } from "react";
import ReciptBar from "./Reciptbar";
import JsBarcode from "jsbarcode";
import { useRecoilState, useRecoilValue } from "recoil";
import { isSearch, searchQuery } from "../state";
import { useToast } from "../hooks/use-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import { aggregateRepos, Day, Month, prInformation, randomId } from "../utils";
import { User } from "../types";

const Recipt = () => {
  const barcodeRef = useRef(null);
  const reciptRef = useRef(null);
  const [search, setIsSearch] = useRecoilState(isSearch);
  const searchUser = useRecoilValue(searchQuery);
  const { toast } = useToast();
  const [User, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState({
    firstLanguage: "",
    secondLanguage: "",
  });
  const [commits, setcommits] = useState({ count: 0, servedBy: "", time: "" , Id : 0});
  const [blob, setBlob] = useState<Blob | null>(null);
  const { theme } = useTheme();

  const VITE_GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  useEffect(() => {
    const fetchUser = async () => {
      const URL = "https://api.github.com/users";
      if (search) {
        if (searchUser.length == 0) {
          toast({
            title: "Please Provide Github Username",
          });
          setIsSearch(false);
          setUser(null);
          return;
        }
        try {
          setLoading(true);
          const resRaw = await fetch(`${URL}/${searchUser}`, {
            headers: {
              Authorization: `token ${VITE_GITHUB_TOKEN}`,
            },
          });
          const res = await resRaw.json();
          if (resRaw.status == 404) {
            toast({
              title: "We don't found any Username",
            });
            setIsSearch(false);
            setLoading(false);
            setUser(null);
            return;
          }
          const {
            starsCount,
            forksCount,
            firstLanguage,
            secondLanguage,
            commitCount,
            servedBy,
          } = await aggregateRepos(searchUser);
          prInformation[0].count = res.public_repos;
          prInformation[3].count = res.followers;
          prInformation[4].count = res.following;
          prInformation[1].count = starsCount;
          prInformation[2].count = forksCount;
          if (!res.name) res.name = "NONE";
          setUser(res);
          setIsSearch(false);
          setLanguages({ firstLanguage, secondLanguage });
          const time = new Date().toLocaleTimeString();
          const Id = randomId();
          setcommits({ count: commitCount, servedBy, time , Id});
          setLoading(false);
        } catch (error) {}
      }
    };
    fetchUser();
  }, [search]);

  useEffect(() => {
    if (barcodeRef.current) {
      const value = `github.com/${searchUser}`;
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        width: 0.7,
        height: 50,
        displayValue: true,
        text: value,
        fontSize: 10,
      });
    }
  }, [User]);

  const downloadImage = () => {
    if (reciptRef.current) {
      html2canvas(reciptRef.current).then(async (canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${User && User.name}_recipt.png`;
        link.click();
        const blob = await (await fetch(canvas.toDataURL())).blob();
        setBlob(blob);
      });
    }
  };

  const shareImage = async () => {
    try {
      let file;
      if (reciptRef.current) {
        if (!blob) {
          const canvas = await html2canvas(reciptRef.current);
          const blob = await (await fetch(canvas.toDataURL())).blob();
          file = new File([blob], `${User?.name}_receipt.png`, {
            type: "image/png",
          });
          setBlob(blob);
        }
      }
      await navigator.share({
        title: "GitHub Receipt",
        text: `GitHub Stats for ${User?.login}`,
        files: [file!],
      });
    } catch (error) {
      toast({
        title: "Some error occured while sharing the file",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {User && !loading ? (
        <div
          ref={reciptRef}
          className="sm:w-[280px] w-10/12 bg-[#FCFCFC] shadow-recipt"
        >
          <ReciptBar />
          <div className="py-6 px-4">
            <div className="flex flex-col items-center">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center text-black">
                GITHUB RECEIPT
              </h4>
              <p className="my-2 text-sm text-black">
                {Day[new Date().getDay() - 1]} , {Month[new Date().getMonth()]}{" "}
                {new Date().getDate()} , {new Date().getFullYear()}
              </p>
              <p className="text-neutral-600 text-center text-sm">
                ORDER #{commits.Id}
              </p>
            </div>
            <div className="my-5">
              <p className="text-sm text-left text-black">
                CUSTOMER : {User.name}
              </p>
              <p className="text-neutral-600">@{User.login}</p>
            </div>
            <div className="p-3 text-black">
              {prInformation.map(({ title, count }, idx) => (
                <div key={idx} className="flex  justify-between my-1">
                  <p>{title}</p>
                  <p>{count}</p>
                </div>
              ))}
            </div>
            <div className="text-black py-2">
              <p>TOP LANGUAGES</p>
              <p>
                {languages.firstLanguage},{languages.secondLanguage}
              </p>
            </div>
            <div className="text-black my-5">
              <div className="flex justify-between">
                <p>MOST ACTIVE DAY:</p>
                <p>Sunday</p>
              </div>
              <div className="flex justify-between">
                <p>COMMITS (30d): </p>
                <p>{commits.count}</p>
              </div>
              <div className="flex justify-between my-5">
                <p className="font-bold">CONTRIBUTION SCORE</p>
                <p className="font-bold">0</p>
              </div>
              <div className="text-neutral-600 text-center text-xs">
                <p>
                  Served by: {commits.servedBy} <br /> {commits.time}
                </p>
              </div>
            </div>
            <div className="w-full max-w-[200px] mx-auto  text-black">
              <p className="text-center uppercase">Thank you for coding</p>
              <svg ref={barcodeRef} style={{ width: "100%" }} />
            </div>
          </div>
          <ReciptBar />
        </div>
      ) : (
        <div className="mt-[100px]">
          {loading ? (
            <ClipLoader
              color={theme == "dark" ? "#FFFFFF" : "#000000"}
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <h1>Please Provider Your Github Username</h1>
          )}
        </div>
      )}
      {User && !loading && (
        <div className="flex gap-6">
          <Button onClick={downloadImage}>
            <Download />
            Download
          </Button>
          <Button onClick={shareImage}>
            <Share2 />
            Share
          </Button>
        </div>
      )}
      <div></div>
    </div>
  );
};

export default Recipt;
