import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние, чтобы следующий рендер показал запасной UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Вы также можете логировать ошибку в внешний сервис
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Вы можете отрендерить любой запасной UI
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#dc3545' }}>
          <h2>Упс, что-то пошло не так.</h2>
          <p>Мы уже работаем над устранением проблемы. Попробуйте обновить страницу.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', textAlign: 'left', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;