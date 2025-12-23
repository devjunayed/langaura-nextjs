import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { stackServerApp } from "@/stack/server";

export default async function Home() {
  const session = await stackServerApp.getUser();
  return (
    <section className="flex  flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block pt-16 max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>learning&nbsp;</span>
        <br />
        <span className={title()}>
          effective and customized.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Create, manage and learn on your pace.
        </div>
      </div>

      <div className="flex gap-3">
        {
          session ?
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={"/dashboard"}
        >
          Dashboard
        </Link>
        :
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/login"
        >
          Login
        </Link>
        }
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      
    </section>
  );
}
