import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MyDispatchContext } from '@/shared/AuthContext';
import { authService } from '@/services/auth-service';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useContext(MyDispatchContext);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await authService.login({
                username: username.trim(),
                password: password.trim()
            });

            const data = res.data;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (dispatch) {
                dispatch({ type: "SET_USER", payload: data.user });
            }

            navigate('/home');
        } catch (err: any) {
            console.error('Lỗi đăng nhập:', err);
            setError(err.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 sm:p-4 overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://i.pinimg.com/736x/8f/4f/83/8f4f836b45cae5270f1d717af7158070.jpg)' }}
            />
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="relative z-20 w-full max-w-[400px]">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/95 flex items-center justify-center mb-5 shadow-xl border-2 border-primary/20 overflow-hidden">
                        <img src="/logo.png" alt="Whisper Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Whisper of Memory</h1>
                    <p className="text-white/80 drop-shadow-sm font-medium">Capture moments through voice</p>
                </div>

                {/* Bento Container */}
                <div className="bg-white/95 rounded-[32px] p-8 shadow-2xl backdrop-blur-sm border border-white/20">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
                        <p className="text-sm text-gray-500">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            placeholder="Username"
                            icon={<Mail className="w-5 h-5 text-gray-400" />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            rightElement={
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-500 p-3 rounded-xl border border-red-100 mt-2 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-medium">{error}</span>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="w-full h-14 mt-4" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-[1px] bg-gray-100" />
                        <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wider">or continue with</span>
                        <div className="flex-1 h-[1px] bg-gray-100" />
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <Button variant="outline" className="flex items-center gap-2">
                            <span className="text-red-500">G</span>
                            <span className="text-sm">Google</span>
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <span className="text-black">A</span>
                            <span className="text-sm">Apple</span>
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm">
                        <span className="text-gray-500 uppercase text-[12px] font-semibold">Don't have an account? </span>
                        <Link to="/register" className="text-primary font-bold hover:underline transition-all">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
