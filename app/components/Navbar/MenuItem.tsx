import Link from "next/link";

/**
 * Properties for the MenuItem component
 */
type MenuItemProps = {
    /**
     * What is the name of the menu
     */
    title: string;

    /**
     * Where should it be navigated
     */
    link: string;

    /**
     * Additional class string
     */
    className?: string;
};

/**
 * This component is a menu item that has a icon and name as display.
 * @param props Properties for the component
 * @returns Rendered element
 */
export default function MenuItem(props: MenuItemProps): JSX.Element {
    return (
        <Link
            href={props.link}
            prefetch={false}
            className={`${props.className ?? ""} py-1 px-3 rounded text-l`}
        >
            {props.title}
        </Link>
    );
}
