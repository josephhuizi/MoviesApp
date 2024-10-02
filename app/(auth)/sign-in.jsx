import {View, Text, ScrollView, Image, Alert} from 'react-native';
import { useState } from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, router} from 'expo-router';

import { images } from '../../constants';
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { getCurrentUser, signIn} from "../../lib/appwrite";
import {useGlobalContext} from "../../context/GlobalProvider";

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const {setUser, setIsLogged } = useGlobalContext();

    const submit = async () => {
        if(!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
        }

        setIsSubmitting(true);

        try {
            await signIn(
                form.email,
                form.password
            );
            const result = await getCurrentUser();
            setUser(result);
            setIsLogged(true);

            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[85vh] h-full px-4 my-6">
                    <Image source={images.logo} resizeMode="contain"
                    className="w-[115px] h-[35px]"/>

                    <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
                        Log in into Aora
                    </Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign in"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-base text-gray-100 font-plight">
                            Don't have account?
                        </Text>
                        <Link href="/sign-up" className="text-base font-psemibold text-secondary-200">
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignIn;