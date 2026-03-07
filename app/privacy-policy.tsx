import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SP_RED = '#E30512';

export default function PrivacyPolicyScreen() {
    const router = useRouter();

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.mainTitle}>Privacy Policy for STF App</Text>
                    <Text style={styles.lastUpdated}>Last Updated: March 07, 2026</Text>
                    
                    <Text style={styles.introText}>
                        Samajwadi Tech Force built the STF app as a Free application. This SERVICE is provided by 
                        <Text style={styles.boldText}> Samajwadi Tech Force </Text> at no cost and is intended for use as is.
                    </Text>

                    <Text style={styles.text}>
                        This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information 
                        if anyone decided to use our Service. If you choose to use our Service, then you agree to the collection and use of 
                        information in relation to this policy.
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>1. Information Collection and Use</Text>
                        <Text style={styles.text}>
                            For a better experience, while using our Service, we may require you to provide us with certain personally identifiable 
                            information, including but not limited to:
                        </Text>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Name and Email Address</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Phone Number and Contact Details</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Device Information (Device ID, OS version)</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Precise Location Data (for location-based features)</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Media files (when creating posters or uploading content)</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>2. Log Data</Text>
                        <Text style={styles.text}>
                            We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and 
                            information (through third-party products) on your phone called Log Data. This Log Data may include information 
                            such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of 
                            the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
                        <Text style={styles.text}>
                            The app does use third-party services that may collect information used to identify you. Links to the privacy 
                            policy of third-party service providers used by the app:
                        </Text>
                        <TouchableOpacity onPress={() => openLink('https://www.google.com/policies/privacy/')} style={styles.linkContainer}>
                            <Text style={styles.linkText}>• Google Play Services</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://firebase.google.com/support/privacy')} style={styles.linkContainer}>
                            <Text style={styles.linkText}>• Firebase Crashlytics & Analytics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://expo.io/privacy')} style={styles.linkContainer}>
                            <Text style={styles.linkText}>• Expo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>4. Data Security</Text>
                        <Text style={styles.text}>
                            We value your trust in providing us your Personal Information, thus we are striving to use commercially 
                            acceptable means of protecting it. But remember that no method of transmission over the internet, or method of 
                            electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>5. Children’s Privacy</Text>
                        <Text style={styles.text}>
                            These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable 
                            information from children under 13. In the case we discover that a child under 13 has provided us with personal 
                            information, we immediately delete this from our servers.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>6. Changes to This Privacy Policy</Text>
                        <Text style={styles.text}>
                            We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. 
                            We will notify you of any changes by posting the new Privacy Policy on this page.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>7. Contact Us</Text>
                        <Text style={styles.text}>
                            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
                        </Text>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactName}>Samajwadi Tech Force</Text>
                            <TouchableOpacity onPress={() => openLink('https://www.samajwaditechforce.com')}>
                                <Text style={styles.linkText}>Website: https://www.samajwaditechforce.com</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openLink('mailto:support@samajwadiparty.in')}>
                                <Text style={styles.linkText}>Email: support@samajwadiparty.in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 20,
    },
    introText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
        marginBottom: 16,
    },
    boldText: {
        fontWeight: '700',
        color: '#000',
    },
    text: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 4,
    },
    bullet: {
        fontSize: 14,
        color: SP_RED,
        marginRight: 8,
        fontWeight: 'bold',
    },
    bulletText: {
        fontSize: 14,
        color: '#475569',
        flex: 1,
    },
    linkContainer: {
        marginVertical: 4,
    },
    linkText: {
        fontSize: 14,
        color: SP_RED,
        textDecorationLine: 'underline',
    },
    contactInfo: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    contactName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
});
