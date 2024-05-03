import React, {ReactNode} from "react";


interface CardProps {
    children: ReactNode;
}

const Card = ({ children }: CardProps) => {
    return (
        <div className="bg-white border lg:w-[800px] shadow-xl   rounded-lg p-4 mb-4">
            {children}
        </div>
    )
}

interface CardHeaderProps {
    children: ReactNode;
}
export const CardHeader = ({children}: CardHeaderProps) => {
    return (
        <div className="mb-4">
            {children}
        </div>
    )
}

interface CardBodyProps {
    children: ReactNode;
}
export const CardBody = ({ children }: CardBodyProps) => {
    return (
        <div className="cardBody">
            {children}
        </div>
    )
}

interface CardFooterProps {
    children: ReactNode;
}
export const CardFooter = ({ children }: CardFooterProps) => {
    return (
        <div className="mt-4">
            {children}
        </div>
    )
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter

export default Card;
