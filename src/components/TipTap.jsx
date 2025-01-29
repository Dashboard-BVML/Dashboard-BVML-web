'use client';
import { useState, useRef, useEffect } from 'react';
import {
    TbQuote,
    TbQuoteOff,
    TbTable,
    TbTableOff,
    TbColumnInsertRight,
    TbColumnRemove,
    TbRowInsertBottom,
    TbRowRemove,
} from 'react-icons/tb';
import { GoHorizontalRule } from 'react-icons/go';
import { LuUndo2, LuRedo2 } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline'; // Import de l'extension souligné
import Link from '@tiptap/extension-link'; // Import de l'extension lien
import Color from '@tiptap/extension-color'; // Import de l'extension couleur
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import History from '@tiptap/extension-history';

import DOMPurify from 'dompurify';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const headingOptions = [
    { id: 0, name: 'Paragraphe' },
    { id: 1, name: 'Titre 1' },
    { id: 2, name: 'Titre 2' },
    { id: 3, name: 'Titre 3' },
    { id: 4, name: 'Titre 4' },
    { id: 5, name: 'Titre 5' },
    { id: 6, name: 'Titre 6' },
];

const predefinedColors = [
    { code: '#FF0000', name: 'Rouge' },
    { code: '#00FF00', name: 'Vert' },
    { code: '#0000FF', name: 'Bleu' },
    { code: '#FFFF00', name: 'Jaune' },
    { code: '#FFA500', name: 'Orange' },
    { code: '#800080', name: 'Violet' },
    { code: '#000000', name: 'Noir' },
    { code: '#FFFFFF', name: 'Blanc' },
];

export default function TipTap() {
    const [error, setError] = useState(null);
    const [content, setContent] = useState(''); // État pour le contenu de l'éditeur
    const [isLoading, setIsLoading] = useState(false); // État de chargement
    const router = useRouter();
    const [selectedHeading, setSelectedHeading] = useState(headingOptions[0]);
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [tempColor, setTempColor] = useState('#000000');
    const textColorPickerRef = useRef(null);
    const bgColorPickerRef = useRef(null);
    const [initialTextColor, setInitialTextColor] = useState('#000000');
    const [initialBgColor, setInitialBgColor] = useState('transparent');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                textColorPickerRef.current &&
                !textColorPickerRef.current.contains(event.target)
            ) {
                setShowTextColorPicker(false);
                setIsColorPickerActive(false);
            }
            if (
                bgColorPickerRef.current &&
                !bgColorPickerRef.current.contains(event.target)
            ) {
                setShowBgColorPicker(false);
                setIsColorPickerActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                table: false,
                tableRow: false,
                tableCell: false,
                tableHeader: false,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            BulletList,
            OrderedList,
            ListItem,
            HorizontalRule,
            HardBreak.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
            Placeholder.configure({
                placeholder: 'Entrez votre texte ici',
            }),
            TextStyle,
            Color.configure({ types: ['textStyle'] }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'tableHeader', 'tableCell'],
            }),
            Underline,
            Link.configure({ openOnClick: true }),
            Highlight.configure({ multicolor: true }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const value = editor.getHTML();
            setContent(DOMPurify.sanitize(value));
        },
    });

    History.configure({
        depth: 100, // Nombre maximum d'états stockés dans l'historique
        newGroupDelay: 500, // Délai en millisecondes pour regrouper les actions
    });

    const handleChange = (option) => {
        setSelectedHeading(option);
        if (option.id === 0) {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().toggleHeading({ level: option.id }).run();
        }
    };

    const handleTextColorChange = (color) => {
        setTempColor(color);
        editor.chain().focus().setColor(color).run();
    };

    const applyTextColor = () => {
        setTextColor(tempColor);
        setShowTextColorPicker(false);
        setIsColorPickerActive(false);
    };

    const resetTextColor = () => {
        setTempColor(initialTextColor);
        editor.chain().focus().setColor(initialTextColor).run();
        setShowTextColorPicker(false);
        setIsColorPickerActive(false);
    };

    const handleBgColorChange = (color) => {
        setTempColor(color);
        editor.chain().focus().setHighlight({ color }).run();
    };

    const applyBgColor = () => {
        setBgColor(tempColor);
        setShowBgColorPicker(false);
        setIsColorPickerActive(false);
    };

    const resetBgColor = () => {
        setTempColor(initialBgColor);
        editor.chain().focus().setHighlight({ color: initialBgColor }).run();
        setShowBgColorPicker(false);
        setIsColorPickerActive(false);
    };

    const handleOpenTextColorPicker = () => {
        setInitialTextColor(textColor);
        setShowTextColorPicker(true);
        setIsColorPickerActive(true); // S'assurer que l'état est mis à jour
        console.log('Text color picker ouvert, isColorPickerActive:', true);
    };

    const handleOpenBgColorPicker = () => {
        setInitialBgColor(bgColor);
        setShowBgColorPicker(true);
        setIsColorPickerActive(true); // S'assurer que l'état est mis à jour
        console.log('Bg color picker ouvert, isColorPickerActive:', true);
    };

    return (
        <>
            <div className='border shadow-xl bordered rounded-xl mt-10'>
                <div className='mt-2'>
                    <div className='flex flex-wrap mx-4 gap-x-10 gap-y-4 justify-start items-center border-b-2 pb-3'>
                        <div className='flex w-full'>
                            <button
                                title='Annuler'
                                onClick={() =>
                                    editor.chain().focus().undo().run()
                                }>
                                <LuUndo2 size={24} />
                            </button>
                            <button
                                title='Refaire'
                                onClick={() =>
                                    editor.chain().focus().redo().run()
                                }>
                                <LuRedo2 size={24} />
                            </button>
                        </div>
                        <div>
                            <Listbox
                                className='w-40'
                                value={selectedHeading}
                                onChange={handleChange}>
                                <div className='relative mt-2'>
                                    <ListboxButton className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm'>
                                        <span className='block truncate'>
                                            {selectedHeading.name}
                                        </span>
                                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                            <ChevronUpDownIcon
                                                className='h-5 w-5 text-gray-400'
                                                aria-hidden='true'
                                            />
                                        </span>
                                    </ListboxButton>
                                    <ListboxOptions className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                                        {headingOptions.map((option) => (
                                            <ListboxOption
                                                key={option.id}
                                                value={option}
                                                className='group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white'>
                                                <span className='block truncate font-normal group-data-[selected]:font-semibold'>
                                                    {option.name}
                                                </span>
                                                <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden'>
                                                    <CheckIcon
                                                        className='h-5 w-5'
                                                        aria-hidden='true'
                                                    />
                                                </span>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                title='Gras'
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-bold'
                                    viewBox='0 0 24 24'>
                                    <path d='M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8'></path>
                                </svg>
                            </button>

                            {/* Bouton Italique */}
                            <button
                                title='Italique'
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-italic'
                                    viewBox='0 0 24 24'>
                                    <path d='M19 4h-9M14 20H5M15 4 9 20'></path>
                                </svg>
                            </button>

                            {/* Bouton Souligné */}
                            <button
                                title='Souligné'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleUnderline()
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-underline'
                                    viewBox='0 0 24 24'>
                                    <path d='M6 4v6a6 6 0 0 0 12 0V4M4 20h16'></path>
                                </svg>
                            </button>

                            {/* Bouton Barré */}
                            <button
                                title='Barré'
                                onClick={() =>
                                    editor.chain().focus().toggleStrike().run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-strikethrough'
                                    viewBox='0 0 24 24'>
                                    <path d='M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16'></path>
                                </svg>
                            </button>
                        </div>
                        <div className='flex gap-2'>
                            {/* Alignement gauche */}
                            <button
                                title='Alignement gauche'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign('left')
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-align-left'
                                    viewBox='0 0 24 24'>
                                    <path d='M15 12H3M17 18H3M21 6H3'></path>
                                </svg>
                            </button>

                            {/* Alignement centre */}
                            <button
                                title='Alignement centre'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign('center')
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-align-center'
                                    viewBox='0 0 24 24'>
                                    <path d='M17 12H7M19 18H5M21 6H3'></path>
                                </svg>
                            </button>

                            {/* Alignement droite */}
                            <button
                                title='Alignement droite'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign('right')
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-align-right'
                                    viewBox='0 0 24 24'>
                                    <path d='M21 12H9M21 18H7M21 6H3'></path>
                                </svg>
                            </button>

                            {/* Alignement justifié */}
                            <button
                                title='Alignement justifié'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign('justify')
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-align-justify'
                                    viewBox='0 0 24 24'>
                                    <path d='M3 12h18M3 18h18M3 6h18'></path>
                                </svg>
                            </button>
                        </div>
                        <div className='flex gap-2'>
                            {/* Bouton pour liste à puces */}
                            <button
                                title='Liste à puces'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-list'
                                    viewBox='0 0 24 24'>
                                    <path d='M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13'></path>
                                </svg>
                            </button>

                            {/* Bouton pour liste numérotée */}
                            <button
                                title='Liste numérotée'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-list-ordered'
                                    viewBox='0 0 24 24'>
                                    <path d='M10 12h11M10 18h11M10 6h11M4 10h2M4 6h1v4M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'></path>
                                </svg>
                            </button>
                        </div>
                        <div className='flex gap-2'>
                            {/* Bouton Lien */}
                            <button
                                title='Ajouter un lien'
                                onClick={() => {
                                    const url = window.prompt('Entrez l’URL');
                                    if (url) {
                                        editor
                                            .chain()
                                            .focus()
                                            .setLink({ href: url })
                                            .run();
                                    }
                                }}
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-link-2'
                                    viewBox='0 0 24 24'>
                                    <path d='M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8'></path>
                                </svg>
                            </button>
                            {/* Bouton Retirer le lien */}
                            <button
                                title='Retirer le lien'
                                onClick={() =>
                                    editor.chain().focus().unsetLink().run()
                                }
                                className='btn'>
                                {/* Icône pour Retirer le lien */}
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-link-2-off'
                                    viewBox='0 0 24 24'>
                                    <path d='M9 17H7A5 5 0 0 1 7 7M15 7h2a5 5 0 0 1 4 8M8 12h4M2 2l20 20'></path>
                                </svg>
                            </button>
                            {/* Bouton Citation */}
                            <button
                                title='Citation'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                className='btn'>
                                <TbQuote size={24} />
                            </button>
                            {/* Bouton pour arrêter la citation */}
                            <button
                                title='Arrêter la citation'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .unsetBlockquote()
                                        .run()
                                }
                                className='btn'>
                                {/* Icône pour arrêter la citation */}
                                <TbQuoteOff size={24} />
                            </button>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                title='Couleur du texte'
                                onClick={handleOpenTextColorPicker}
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-palette'
                                    viewBox='0 0 24 24'>
                                    <circle
                                        cx='13.5'
                                        cy='6.5'
                                        r='0.5'
                                        fill='currentColor'></circle>
                                    <circle
                                        cx='17.5'
                                        cy='10.5'
                                        r='0.5'
                                        fill='currentColor'></circle>
                                    <circle
                                        cx='8.5'
                                        cy='7.5'
                                        r='0.5'
                                        fill='currentColor'></circle>
                                    <circle
                                        cx='6.5'
                                        cy='12.5'
                                        r='0.5'
                                        fill='currentColor'></circle>
                                    <path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2'></path>
                                </svg>
                            </button>
                            {showTextColorPicker && (
                                <div
                                    ref={textColorPickerRef}
                                    className='absolute z-20 bg-white p-4 shadow-lg rounded bottom-10 left-1/2 transform -translate-x-1/2'>
                                    <p className='text-center mb-4'>
                                        Couleur du texte :
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color.code}
                                                onClick={() =>
                                                    handleTextColorChange(
                                                        color.code,
                                                    )
                                                }
                                                className='w-8 h-8 rounded border'
                                                style={{
                                                    backgroundColor: color.code,
                                                }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <div className='flex justify-center gap-2 mt-2'>
                                        <button
                                            onClick={applyTextColor}
                                            className='px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'>
                                            Valider
                                        </button>
                                        <button
                                            onClick={resetTextColor}
                                            className='px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400'>
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Bouton pour changer la couleur de fond */}
                            <button
                                title='Couleur de fond'
                                onClick={handleOpenBgColorPicker}
                                className='btn'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='lucide lucide-paint-bucket'
                                    viewBox='0 0 24 24'>
                                    <path d='m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0zM5 2l5 5M2 13h15M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4'></path>
                                </svg>
                            </button>
                            {showBgColorPicker && (
                                <div
                                    ref={bgColorPickerRef}
                                    className='absolute z-20 bg-white p-4 shadow-lg rounded bottom-10 left-1/2 transform -translate-x-1/2'>
                                    <p className='text-center mb-4'>
                                        Couleur de fond :
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color.code}
                                                onClick={() =>
                                                    handleBgColorChange(
                                                        color.code,
                                                    )
                                                }
                                                className='w-8 h-8 rounded border'
                                                style={{
                                                    backgroundColor: color.code,
                                                }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <div className='flex justify-center gap-2 mt-2'>
                                        <button
                                            onClick={applyBgColor}
                                            className='px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'>
                                            Valider
                                        </button>
                                        <button
                                            onClick={resetBgColor}
                                            className='px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400'>
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button
                                title='Ajouter une ligne horizontale'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setHorizontalRule()
                                        .run()
                                }>
                                <GoHorizontalRule size={24} />
                            </button>
                        </div>
                        <div className='flex gap-2 w-full'>
                            {/* Bouton pour insérer un tableau */}
                            <button
                                title='Insérer un tableau'
                                onClick={() => {
                                    editor
                                        .chain()
                                        .focus()
                                        .insertTable({
                                            rows: 3,
                                            cols: 3,
                                            withHeaderRow: true,
                                        })
                                        .run();
                                }}
                                className='btn'>
                                <TbTable size={24} />
                            </button>

                            {/* Bouton pour ajouter une ligne après */}
                            <button
                                title='Ajouter une ligne après'
                                onClick={() => {
                                    editor.chain().focus().addRowAfter().run();
                                }}
                                className='btn'>
                                <TbRowInsertBottom size={24} />
                            </button>

                            {/* Bouton pour supprimer une ligne */}
                            <button
                                title='Supprimer la ligne'
                                onClick={() => {
                                    editor.chain().focus().deleteRow().run();
                                }}
                                className='btn'>
                                <TbRowRemove size={24} />
                            </button>

                            {/* Bouton pour ajouter une colonne après */}
                            <button
                                title='Ajouter une colonne après'
                                onClick={() => {
                                    editor
                                        .chain()
                                        .focus()
                                        .addColumnAfter()
                                        .run();
                                }}
                                className='btn'>
                                <TbColumnInsertRight size={24} />
                            </button>

                            {/* Bouton pour supprimer une colonne */}
                            <button
                                title='Supprimer la colonne'
                                onClick={() => {
                                    editor.chain().focus().deleteColumn().run();
                                }}
                                className='btn'>
                                <TbColumnRemove size={24} />
                            </button>

                            {/* Bouton pour supprimer le tableau */}
                            <button
                                title='Supprimer le tableau'
                                onClick={() => {
                                    editor.chain().focus().deleteTable().run();
                                }}
                                className='btn'>
                                {/* Icône SVG pour supprimer le tableau */}
                                <TbTableOff size={24} />
                            </button>
                        </div>
                    </div>

                    <EditorContent editor={editor} className='p-4' />
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                className='Tiptap'></div>
        </>
    );
}
