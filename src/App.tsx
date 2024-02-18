import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "./components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type typeRepos = {
  name: string;
  language: string;
  html_url: string;
  clone_url: string;
  owner: { login: string };
};

type typeUser = {
  login: string;
  name: string;
  location: string;
  bio: string;
};

function App() {
  const { toast } = useToast();
  const [repos, setRepos] = useState<typeRepos[]>([]);
  const [user, setUser] = useState<typeUser>();
  const [editingUser, setEditingUser] = useState("all4x");

  useEffect(() => {
    fetch(`https://api.github.com/users/${editingUser}/repos`).then(
      (response) =>
        response.json().then((data: typeRepos[]) => {
          setRepos(data);
        }),
    );

    fetch(`https://api.github.com/users/${editingUser}`).then((response) => {
      response.json().then((data: typeUser) => {
        setUser(data);
      });
    });
  }, [editingUser]);

  return (
    <div className="h-screen bg-gray-950">
      <div className="xl:py-20 p-10 bg-gray-950">
        <div>
          <div className="flex justify-between pb-6 gap-3">
            <div className="flex justify-center items-center gap-2">
              <Avatar>
                <AvatarImage src={`https://github.com/${user?.login}.png`} />
                <AvatarFallback className="text-white font-bold">
                  {user?.login.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input
                type="text"
                defaultValue={editingUser}
                className="text-white border-gray-600"
                onBlur={(e) => setEditingUser(e.target.value)}
              />
            </div>
            <div className="text-white  font-sans">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="max-w-sm">
                  <AccordionTrigger className="font-mono ">
                    {user?.name}
                  </AccordionTrigger>
                  <AccordionContent>{user?.bio}</AccordionContent>
                  <AccordionContent>{user?.location}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div className="flex justify-center ">
            <Table>
              <TableCaption>maked by @sr_all3x</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead className="text-center">Language</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead className="text-right">Clone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repos.map((repo) => (
                  <TableRow key={repo.name} className="text-zinc-300">
                    <TableCell className="font-medium text-nowrap">
                      {repo.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {repo.language}
                    </TableCell>
                    <TableCell className="max-w-2 truncate">
                      <Button
                        variant="link"
                        onClick={() => {
                          window.open(`${repo.html_url}`);
                        }}
                      >
                        {repo.html_url}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right max-w-sm">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(`${repo.clone_url}`)
                            .then(() =>
                              toast({
                                title: "Copied to clipboard!",
                                description: `${repo.clone_url}`,
                              }),
                            );
                        }}
                      >
                        Clone
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
