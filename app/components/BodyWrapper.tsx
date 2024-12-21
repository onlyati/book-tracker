import { ReactNode } from "react";

/**
 * Type definition for the component
 */
type BodyWrapperProps = {
    /**
     * Child node
     */
    children: ReactNode;
};

/**
 * Body wrapper component for the layout
 * @param props Properties for the component
 * @returns With a wrapper element
 */
export default function BodyWrapper(props: BodyWrapperProps): JSX.Element {
    return <div className="container mx-auto">{props.children}</div>;
}
