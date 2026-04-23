import ProfileForm from "@/app/profile/ProfileForm";

export default async function Home() {
    return (
        <div className="flex flex-col items-center justify-center bg-blue-200 p-4 min-h-screen">
            <ProfileForm />
        </div>
    );
}