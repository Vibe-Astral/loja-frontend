"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { Menu,} from "lucide-react";
import '../index.css'
// Importe os componentes do Shadcn/UI que você vai precisar
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils"; // Certifique-se que o caminho para seu `cn` utility está correto

// Seus dados de componentes
const acess: { title: string; href: string; description: string }[] = [
  {
    title: "Área Do Cliente",
    href: "/client/portal",
    description:
      "Acesso De clientes Fidelizados, Clique para saber mais",
  },
  {
    title: "Área Do Tecnico",
    href: "/tecnico/portal",
    description:
      "Area de Acesso para tecnicos cadastrados",
  },{
    title: "Área Do Consultor",
    href: "/consultor/portal",
    description:
      "Area de Acesso para consultores cadastrados",
  }
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    // Fundo da barra de navegação com azul escuro
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur ">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          {/* O nome da marca em branco ou em uma cor que contraste bem */}
          <span className="font-bold p-3 text-accent">LUIZ TEC</span>
        </Link>

        {/* == 1. NAVEGAÇÃO PARA DESKTOP == */}
        <nav className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "p-2 text-primary hover:text-white"
                    )}
                  >
                    Página Inicial
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>


              {/* Item 'Áreas de Acesso' */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "font-medium p-2 text-primary hover:text-white"
                  )}
                >
                  Áreas De Acesso
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-full gap-3 p-4 md:grid-cols-2 max-w-xl min-w-[300px] lg:w-fit ">
                    {acess.map((acess) => (
                      <ListItem
                        key={acess.title}
                        title={acess.title}
                        to={acess.href}
                        // Fundo azul escuro no hover e texto laranja
                        className="text-primary hover:text-white "
                      >
                        {acess.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/sobre" className="p-2">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      // Cor do texto do link azul médio, com hover laranja
                      "text-primary hover:text-white"
                    )}
                  >
                    Sobre
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* == 2. NAVEGAÇÃO PARA MOBILE (Visível em telas menores que 'md') == */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6 text-white" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#1a2730] text-white">
              <SheetHeader>
                <SheetTitle className="text-white">LUIS TEC</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link
                  to="/"
                  className="font-medium p-2 hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Página Inicial
                </Link>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="acess">
                    <AccordionTrigger
                      className="p-2 hover:bg-accent"
                    >
                      Áreas De Acesso
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-4">
                      {acess.map((acess) => (
                        <Link
                          key={acess.title}
                          to={acess.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="hover:text-accent"
                        >
                          {acess.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  to="/sobre"
                  className="font-medium p-2 hover:bg-[#ce711e] hover:text-[#1a2730]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Componente ListItem atualizado para usar React.forwardRef e `cn` para estilos corretos
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"