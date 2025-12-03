import { ImgHTMLAttributes } from "react";

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/img/logo.webp"   // path dari folder public
            alt={props.alt ?? "Application Logo"}
        />
    );
}
