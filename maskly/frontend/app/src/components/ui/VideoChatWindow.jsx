import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deductBalance, checkBalance } from '../../store/slices/walletSlice';
import RatingModal from '../modals/RatingModal';

const VideoChatWindow = ({ gender }) => {
    const dispatch = useDispatch();
    const [callDuration, setCallDuration] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [currentRate, setCurrentRate] = useState(1);
    const [balanceWarning, setBalanceWarning] = useState('');
    const intervalRef = useRef(null);
    const balance = useSelector(state => state.wallet.balance);
    const discountActive = useRef(false);
    const mutualRating = useRef(false);

    // 初始化计时器
    useEffect(() => {
        startBillingTimer();
        return () => clearInterval(intervalRef.current);
    }, []);

    // 每分钟计费逻辑
    const startBillingTimer = () => {
        intervalRef.current = setInterval(() => {
            setCallDuration(prev => {
                const newDuration = prev + 1;
                calculateCost(newDuration);
                checkBalanceThreshold(newDuration);
                return newDuration;
            });
        }, 60000); // 每分钟触�?
    };

    // 费用计算
    const calculateCost = (minutes) => {
        let rate = currentRate;
        if (minutes >= 30 && mutualRating.current) {
            rate = gender === 'male' ? 0.1 : 0;
        } else if (minutes >= 30) {
            rate = 0.5;
        }
        
        const cost = minutes * rate;
        setTotalCost(cost);
        dispatch(deductBalance(rate));
    };

    // 余额检�?
    const checkBalanceThreshold = (minutes) => {
        dispatch(checkBalance()).then((currentBalance) => {
            if (currentBalance <= -20) {
                endCall();
                alert('余额不足-20H，请充�?);
            } else if (currentBalance <= -10) {
                setBalanceWarning(`余额不足: ${currentBalance}H，请及时充值`);
            }
        });
    };

    // 结束通话处理
    const endCall = () => {
        clearInterval(intervalRef.current);
        setShowRating(true);
    };

    // 评价提交处理
    const handleRatingSubmit = (userRating) => {
        // 实现评价提交逻辑
        mutualRating.current = userRating === 'satisfied'; // 假设从API获取双方评价结果
        calculateCost(callDuration); // 最终费用计�?
        setShowRating(false);
    };

    return (
        <View style={styles.container}>
            {/* 视频元素 */}
            <video autoPlay playsInline style={styles.video} />
            
            {/* 计时和费用显�?*/}
            <View style={styles.infoOverlay}>
                <Text style={styles.timerText}>
                    通话时间: {Math.floor(callDuration/60)}分{callDuration%60}�?
                </Text>
                <Text style={styles.costText}>累计费用: {totalCost.toFixed(1)}H</Text>
                {balanceWarning && (
                    <Text style={styles.warningText}>{balanceWarning}</Text>
                )}
            </View>

            {/* 评价弹窗 */}
            <RatingModal
                visible={showRating}
                onClose={() => setShowRating(false)}
                onSubmit={handleRatingSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    infoOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 8,
    },
    timerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    costText: {
        color: '#4CAF50',
        fontSize: 14,
        marginTop: 5,
    },
    warningText: {
        color: '#FF5722',
        fontSize: 14,
        marginTop: 5,
    },
});

export default VideoChatWindow;

