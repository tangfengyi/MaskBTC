import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { startMatchmaking, skipMatch } from '../../store/slices/matchmakingSlice';

const MatchScreen = () => {
    const dispatch = useDispatch();
    const [preferences, setPreferences] = useState({
        gender: 'any',
        ageRange: 'any',
        location: 'any'
    });
    const [isMatching, setIsMatching] = useState(false);
    const [remainingSkips, setRemainingSkips] = useState(5);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let interval;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleStartMatch = async () => {
        try {
            setIsMatching(true);
            const result = await dispatch(startMatchmaking(preferences)).unwrap();
            setRemainingSkips(result.remainingSkips || 5);
        } catch (error) {
            Alert.alert('匹配失败', error.message);
        } finally {
            setIsMatching(false);
        }
    };

    const handleSkip = async () => {
        try {
            const result = await dispatch(skipMatch()).unwrap();
            setRemainingSkips(result.remainingSkips);
            setCooldown(30);
        } catch (error) {
            if (error.cooldown) {
                setCooldown(error.cooldown);
            }
            Alert.alert('操作失败', error.error || error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>视频匹配设置</Text>
            
            <View style={styles.preferenceSection}>
                <Text style={styles.label}>性别偏好</Text>
                <Picker
                    selectedValue={preferences.gender}
                    onValueChange={(value) => setPreferences({...preferences, gender: value})}
                    style={styles.picker}>
                    <Picker.Item label="不限" value="any" />
                    <Picker.Item label="男�? value="male" />
                    <Picker.Item label="女�? value="female" />
                </Picker>
            </View>

            <View style={styles.preferenceSection}>
                <Text style={styles.label}>年龄范围</Text>
                <Picker
                    selectedValue={preferences.ageRange}
                    onValueChange={(value) => setPreferences({...preferences, ageRange: value})}
                    style={styles.picker}>
                    <Picker.Item label="不限" value="any" />
                    <Picker.Item label="±5�? value="±5" />
                    <Picker.Item label="±10�? value="±10" />
                    <Picker.Item label="±15�? value="±15" />
                </Picker>
            </View>

            <View style={styles.preferenceSection}>
                <Text style={styles.label}>地区偏好</Text>
                <Picker
                    selectedValue={preferences.location}
                    onValueChange={(value) => setPreferences({...preferences, location: value})}
                    style={styles.picker}>
                    <Picker.Item label="不限" value="any" />
                    <Picker.Item label="同城" value="same_city" />
                    <Picker.Item label="异地" value="different_city" />
                </Picker>
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    剩余跳过次数: {remainingSkips}
                </Text>
                {cooldown > 0 && (
                    <Text style={styles.cooldownText}>
                        冷却时间剩余: {cooldown}�?
                    </Text>
                )}
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity 
                    style={[styles.button, (isMatching || cooldown > 0) && styles.disabledButton]}
                    onPress={handleStartMatch}
                    disabled={isMatching || cooldown > 0}>
                    <Text style={styles.buttonText}>
                        {isMatching ? '匹配�?..' : '开始匹�?}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.skipButton, (remainingSkips <= 0 || cooldown > 0) && styles.disabledButton]}
                    onPress={handleSkip}
                    disabled={remainingSkips <= 0 || cooldown > 0}>
                    <Text style={styles.buttonText}>跳过当前匹配</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    preferenceSection: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    picker: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    statusContainer: {
        marginVertical: 15,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        color: '#28a745',
        marginBottom: 5,
    },
    cooldownText: {
        fontSize: 14,
        color: '#dc3545',
    },
    buttonGroup: {
        gap: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    skipButton: {
        backgroundColor: '#ffc107',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default MatchScreen;

