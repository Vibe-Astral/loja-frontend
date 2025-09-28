// src/pages/About.tsx
import { Navbar } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
    const stores = [
        {
            id: 1,
            title: "Loja 01",
            box: "Box 02",
            address: "Avenida Brasil 277, Galeria Brasil, Boqueirão",
            map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.399193094849!2d-49.266!3d-25.508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce44b0d1a5f4f%3A0xf6d2a01e7b9fcb6!2sAv.%20Brasil%2C%20277%20-%20Boqueir%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1690312345678",
        },
        {
            id: 2,
            title: "Loja 02",
            box: "Box 79/80",
            address: "Avenida Costa e Silva 501, Galeria PG, Boqueirão",
            map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.399193094849!2d-49.270!3d-25.509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce44b0d1a5f4f%3A0xf6d2a01e7b9fcb6!2sAv.%20Costa%20e%20Silva%2C%20501%20-%20Boqueir%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1690312345679",
        },
        {
            id: 3,
            title: "Loja 03",
            box: "Box 23/24",
            address: "Avenida Costa e Silva 501, Galeria PG, Boqueirão",
            map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.399193094849!2d-49.270!3d-25.509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce44b0d1a5f4f%3A0xf6d2a01e7b9fcb6!2sAv.%20Costa%20e%20Silva%2C%20501%20-%20Boqueir%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1690312345680",
        },
    ]

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-6">
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary">Sobre Nossas Lojas</h1>
                    <p className="text-gray-600 mt-4">
                        Conheça os endereços de nossas unidades no Boqueirão.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                    {stores.map((store) => (
                        <Card key={store.id} className="shadow-lg hover:shadow-xl transition rounded-2xl overflow-hidden">
                            <CardContent className="p-6 flex flex-col gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-2">{store.title}</h2>
                                    <p className="text-sm text-gray-500 mb-1">{store.box}</p>
                                    <p className="text-gray-700">{store.address}</p>
                                </div>

                                <iframe
                                    src={store.map}
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
