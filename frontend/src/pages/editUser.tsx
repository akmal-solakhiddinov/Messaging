import BackButton from "@/components/ui/backButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import useEditUser from "@/hooks/useEditUser";
import useSEO from "@/hooks/useSEO";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema
const userSchema = z.object({
    fullName: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    account: z.enum(['private', 'public']).optional(),
    image: z.union([z.string(), z.instanceof(FileList)]).optional(),
});

type Schema = z.infer<typeof userSchema>;

const EditUser = () => {
    const { user } = useAuth();
    const { editUser } = useEditUser();
    useSEO('Edit User')


    const { handleSubmit, register, formState: { isSubmitting, errors } } = useForm<Schema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: user?.fullName,
            username: user?.username,
            email: user?.email,
            account: user?.account,
            image: '',
        },
    });

    const onSubmit = async (data: Schema) => {
        try {
            const formData = new FormData();

            if (data.fullName) formData.append('fullName', data.fullName);
            if (data.username) formData.append('username', data.username);
            if (data.email) formData.append('email', data.email);
            if (data.account && data.account !== user?.account) formData.append('account', data.account);

            if (data.image && data.image instanceof FileList && data.image.length > 0) {
                const image = data.image[0];
                formData.append('image', image);
            }

            editUser(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="p-8 min-h-screen">
            <BackButton />
            <div className="max-w-lg mx-auto p-5 bg-white rounded-xl  shadow-lg ">
                <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Edit Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            {...register('fullName')}
                            className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                            placeholder="Your Full Name"
                        />
                        {errors.fullName && <p className="text-red-600 text-sm mt-1">Full Name is required</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            {...register('username')}
                            className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                            placeholder="Your Username"
                        />
                        {errors.username && <p className="text-red-600 text-sm mt-1">Username is required</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                            placeholder="Your Email"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">Valid email is required</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Account Type</label>
                        <select
                            {...register('account')}
                            className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                        <input
                            type="file"
                            {...register('image')}
                            className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                            accept="image/*"
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
                        {isSubmitting ? 'Submitting...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </div>

    );
};

export default EditUser;
