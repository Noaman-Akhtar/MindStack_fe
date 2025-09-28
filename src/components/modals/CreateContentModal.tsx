import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { CrossIcon } from "../icons/CrossIcon";
import { Input } from "../ui/Input";
import { BACKEND_URL } from "../../config";
import { getYouTubeId, isValidTwitterUrl } from "../../utils/embed";
import axios from "axios";
import { RichTextEditor } from "../ui/RichTextEditor/RichtextEditor";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
    RandomLinks = "random",
}

interface CreateContentModalProps {
    onClose?: () => void;
    onContentAdded?: () => void;
}

export function CreateContentModal({
    onClose,
    onContentAdded,
}: CreateContentModalProps) {
    const [richNote,setRichNote] = useState("");
    const [richNoteDelta,setRichNoteDelta] = useState<any>(null);
    const titleref = useRef<HTMLInputElement>(null);
    const linkref = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentType | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const noteRef = useRef<HTMLTextAreaElement>(null);

    const [typeError, setTypeError] = useState<string | null>(null);
    const typeOptions: { label: string; value: ContentType }[] = [
        { label: "YouTube", value: ContentType.Youtube },
        { label: "Twitter", value: ContentType.Twitter },
        { label: "Random links", value: ContentType.RandomLinks },
    ];
    const currentLabel =
        typeOptions.find((o) => o.value === type)?.label ?? "Select type";

    async function addcontent() {
        const title = (titleref.current?.value ?? "").trim();
        const link = (linkref.current?.value ?? "").trim();
        const note = (noteRef.current?.value ?? "").trim();

        // Validate required fields
        if (!type) {
            setTypeError("Please choose a type");
            return;
        }
        if (type == "youtube" && (link == "" || !getYouTubeId(link))) {
            setTypeError("Please enter a valid YouTube link");
            return;
        }
        if (type == "twitter" && (link == "" || !isValidTwitterUrl(link))) {
            setTypeError("Please enter a valid Twitter link");
            return;
        }
        setTypeError(null);
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/content`,
                {
                    link,
                    title,
                    type,
                    note,
                    richNote,
                    richNoteDelta
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            onClose?.();
            onContentAdded?.();
        } catch (error) {
            console.error("Error adding content:", error);
            setTypeError("Failed to add content. Please try again.");
        }
    }

    return (
        <div className="flex flex-col justify-center relative">
            <div
                className="bg-white p-10 w-250px rounded-md max-h-[calc(110vh-4rem)] overflow-y-auto max-w-[95vw]"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="absolute top-[1%] right-[1%] cursor-pointer" onClick={onClose}>
                    <CrossIcon />
                </div>
                <div className="w-220 flex flex-col  gap-y-2">
                    <Input
                        variant="primary"
                        ref={titleref}
                        placeholder={"Title"}
                        type="text"
                    />
                    <Input
                        variant="primary"
                        ref={linkref}
                        placeholder={"Link"}
                        type="text"
                    />
                    <div>
                        <textarea
                            ref={noteRef}
                            placeholder="Notes (optional)"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:black focus:border-transparent"
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="mt-2 focus:ring-2 focus:black focus:border-transparent">
                        <RichTextEditor onDeltaChange={setRichNoteDelta} onHtmlChange={setRichNote}/>
                    </div>
                    

                    <div className="relative mt-2 flex justify-center ">
                        <div onClick={() => setMenuOpen((v) => !v)}>
                            <Button
                                variant="primary"
                                size="md"
                                text={`Type: ${currentLabel}`}
                            />
                        </div>
                        {menuOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg ring-1 ring-black/5 z-50">
                                {typeOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${opt.value === type ? "bg-gray-50 font-medium" : ""
                                            }`}
                                        onClick={() => {
                                            setType(opt.value);
                                            setTypeError(null);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-center mt-3">
                    <Button
                        variant="primary"
                        size="md"
                        text="submit"
                        onClick={addcontent}
                    ></Button>
                </div>
                {typeError && (
                    <div className="flex justify-center">
                        <div className="mt-2 text-sm text-red-600">{typeError}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
