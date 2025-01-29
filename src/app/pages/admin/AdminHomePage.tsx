"use client"
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebaseConfig';

export default function AdminHomePage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'collection_test'),
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(items);
            },
        );

        // Nettoyage de l'abonnement pour éviter les fuites de mémoire
        return () => unsubscribe();
    }, []);

    return (
        <>
            <section>
                <h1 className='heading1'>
                    Bienvenue sur la page d'administration
                </h1>
            </section>

            <section>
                <h2>Données de Firestore</h2>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>{item.test1}</li>
                    ))}
                </ul>
            </section>
        </>
    );
}
