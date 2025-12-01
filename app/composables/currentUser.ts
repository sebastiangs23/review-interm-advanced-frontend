import { useRouter } from 'vue-router'

export function useCurrentUser(){
    const router = useRouter();
    const isUserLogged = () => {
        try{
            const storedUser = localStorage.getItem("currentUser");
            
            if(!storedUser){
                router.push('/');
                return null;
            }else {
                return JSON.parse(storedUser);
            };

        }catch(error){
            throw new Error(error);
        }
    };

    isUserLogged();
};