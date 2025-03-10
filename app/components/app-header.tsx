import { Link } from "react-router"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu"

export const AppHeader = () => {
    return (
        <header className="flex items-center justify-between p-4">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>User</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink asChild>
                                <Link to="/user/profile">Profile</Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link to="/user/logout">Logout</Link>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink asChild>
                                <Link to="/account/login">Login</Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link to="/account/register">Register</Link>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}
