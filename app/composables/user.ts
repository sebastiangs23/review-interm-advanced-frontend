import { useRouter } from 'vue-router'

export function useCurrentUser(){
    const router = useRouter();
    const isUserLogged = () => {
        try{
            const storedUser = localStorage.getItem("currentUser");
            console.log('storared User', storedUser)    
            if(!storedUser){
                console.log('gets redirected')
                router.push('/');
                return null;
            }else {
                return JSON.parse(storedUser);
            };

        }catch(error){
            console.log(error);
        }
    };

    isUserLogged();
};